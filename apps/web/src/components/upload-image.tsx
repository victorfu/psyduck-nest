import React, { useState, useEffect } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import type { GetProp, UploadProps } from "antd";
import { uploadImage } from "../lib/firebase";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    void message.error("You can only upload JPG/PNG file!");
  }
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    void message.error("Image must smaller than 10MB!");
  }
  return isJpgOrPng && isLt10M;
};

interface UploadImageProps {
  value?: string;
  onChange?: (url: string) => void;
  id?: string;
}

export const UploadImage: React.FC<UploadImageProps> = ({
  value,
  onChange,
  id,
}) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  // Initialize imageUrl with value prop if provided
  useEffect(() => {
    if (value) {
      setImageUrl(value);
    } else {
      setImageUrl(undefined);
    }
  }, [value]);

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status === "done") {
      // Upload to Firebase
      if (info.file.originFileObj) {
        uploadImage(info.file.originFileObj, (url) => {
          setLoading(false);
          setImageUrl(url);
          // Call onChange to update form value if provided
          onChange?.(url);
        });
      }
    }
  };

  const customRequest: UploadProps["customRequest"] = (options) => {
    const { onSuccess } = options;
    setTimeout(() => {
      onSuccess?.("ok");
    }, 0);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上傳圖片</div>
    </button>
  );

  return (
    <Upload
      id={id}
      name="image"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      customRequest={customRequest}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};
