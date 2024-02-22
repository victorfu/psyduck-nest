import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FirebaseConfig } from "../config/configuration.interface";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import * as fs from "fs";

@Injectable()
export class FirebaseAdminService {
  private readonly firebaseAdmin;

  constructor(private readonly configService: ConfigService) {
    this.firebaseAdmin = this.initializeFirebaseAdmin();
  }

  private initializeFirebaseAdmin() {
    const firebaseConfig = this.configService.get<FirebaseConfig>("firebase");
    const serviceAccount = JSON.parse(
      fs.readFileSync(firebaseConfig.adminSdkPath, "utf8"),
    );
    if (getApps().length === 0) {
      return initializeApp({
        credential: cert(serviceAccount),
        storageBucket: firebaseConfig.storageBucket,
      });
    } else {
      return getApp();
    }
  }

  private getUrl(fileName: string) {
    return getStorage().bucket().file(fileName).publicUrl();
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

    return this.getUrl(destination);
  }
}
