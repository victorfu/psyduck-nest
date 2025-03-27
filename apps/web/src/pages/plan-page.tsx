import { UploadImage } from "@/components/upload-image";

const PlanPage = () => {
  const onChange = (url: string) => {
    console.log(url);
  };

  return (
    <div className="space-y-4">
      <UploadImage onChange={onChange} />
    </div>
  );
};

export default PlanPage;
