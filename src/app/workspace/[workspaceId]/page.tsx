"use client";
interface WorkSpaceIdPageProps {
  params: {
    workspaceId: string;
  };
}
const WorkSpaceIdPage = ({ params }: WorkSpaceIdPageProps) => {
  console.log(params);
  return (
    <div className="text-white">
      <p>{params.workspaceId}</p>
    </div>
  );
};

export default WorkSpaceIdPage;
