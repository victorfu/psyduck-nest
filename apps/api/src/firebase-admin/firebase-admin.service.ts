import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FirebaseConfig } from "../config/configuration.interface";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";
import * as fs from "fs";
import { CreateRequest, getAuth, UpdateRequest } from "firebase-admin/auth";
import { Query, WhereFilterOp } from "firebase-admin/firestore";
import { LineUserDto } from "@/line-sdk/dto/line-user.dto";

@Injectable()
export class FirebaseAdminService {
  private readonly firebaseAdmin;

  constructor(private readonly configService: ConfigService) {
    this.firebaseAdmin = this.initializeFirebaseAdminSdk();
  }

  private initializeFirebaseAdminSdk() {
    const firebaseConfig = this.configService.get<FirebaseConfig>("firebase");
    const serviceAccount = JSON.parse(
      fs.readFileSync(firebaseConfig.adminSdkPath, "utf8"),
    );
    if (getApps().length === 0) {
      return initializeApp({
        credential: cert(serviceAccount),
        storageBucket: `${serviceAccount.project_id}.appspot.com`,
      });
    } else {
      return getApp();
    }
  }

  private async getUrl(fileName: string) {
    const fileRef = getStorage().bucket().file(fileName);
    await fileRef.makePublic();
    return fileRef.publicUrl();
  }

  async uploadFile(file: Express.Multer.File, destination: string) {
    const buffer = file.buffer;
    const bucket = getStorage().bucket();

    await bucket.file(destination).save(buffer, {
      metadata: {
        contentType: file.mimetype,
        originalname: file.originalname,
      },
    });

    return await this.getUrl(destination);
  }

  getDb() {
    return getFirestore();
  }

  verifyIdToken(token: string) {
    return getAuth().verifyIdToken(token);
  }

  createUser(properties: CreateRequest) {
    return getAuth().createUser(properties);
  }

  getUser(uid: string) {
    return getAuth().getUser(uid);
  }

  getUsers(uids: string[]) {
    return getAuth().getUsers(uids.map((uid) => ({ uid })));
  }

  updateUser(uid: string, properties: UpdateRequest) {
    return getAuth().updateUser(uid, properties);
  }

  deleteUser(uid: string) {
    return getAuth().deleteUser(uid);
  }

  listUsers(maxResults?: number, pageToken?: string) {
    return getAuth().listUsers(maxResults, pageToken);
  }

  resetPassword(uid: string, password: string) {
    return getAuth().updateUser(uid, { password });
  }

  async getLineUsersByFilters(
    filters: { field: string; operator: string; value: any }[],
  ) {
    const db = this.getDb();
    let query: Query = db.collection("line-users");

    filters.forEach((filter) => {
      query = query.where(
        filter.field,
        filter.operator as WhereFilterOp,
        filter.value,
      );
    });

    const snapshot = await query.get();
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as LineUserDto,
    );
  }

  async getLineUsersByLineUserId(lineUserId: string, workspaceId: string) {
    const filters = [
      { field: "lineUserId", operator: "==", value: lineUserId },
      { field: "workspaceId", operator: "==", value: workspaceId },
    ];
    return this.getLineUsersByFilters(filters);
  }

  async getLineUsersByMemberId(memberId: string, workspaceId: string) {
    const filters = [
      { field: "memberId", operator: "==", value: memberId },
      { field: "workspaceId", operator: "==", value: workspaceId },
    ];
    return this.getLineUsersByFilters(filters);
  }

  async getMembersByPhone(phone: string, workspaceId: string) {
    const db = this.getDb();
    const snapshot = await db
      .collection("members")
      .where("phone", "==", phone)
      .where(`workspaceIds.${workspaceId}`, "==", true)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async findTeamMembers(id: string) {
    const db = this.getDb();
    const snapshot = await db.collection("workspaces").doc(id).get();
    const data = snapshot.data();
    const { uids } = data;
    const { users } = await this.getUsers(uids);
    return users.map((user) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      disabled: user.disabled,
    }));
  }
}
