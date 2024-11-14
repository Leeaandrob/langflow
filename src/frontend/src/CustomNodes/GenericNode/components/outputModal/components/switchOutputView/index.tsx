import { LogsLogType, OutputLogType } from "@/types/api";
import DataOutputComponent from "../../../../../../components/dataOutputComponent";
import ForwardedIconComponent from "../../../../../../components/genericIconComponent";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../../../../components/ui/alert";
import { Case } from "../../../../../../shared/components/caseComponent";
import TextOutputView from "../../../../../../shared/components/textOutputView";
import useFlowStore from "../../../../../../stores/flowStore";
import ErrorOutput from "./components";
// Define the props type
interface SwitchOutputViewProps {
  nodeId: string;
  outputName: string;
  type: "Outputs" | "Logs";
}
const SwitchOutputView: React.FC<SwitchOutputViewProps> = ({
  nodeId,
  outputName,
  type,
}) => {
  function isBase64Image(str: string): boolean {
    const regex =
      /^data:image\/(?:png|jpg|jpeg|gif);base64,[a-zA-Z0-9+/]+={0,2}$/;
    return regex.test(str);
  }

  function isVideoUrl(url: string): boolean {
    const regex = /^https?:\/\/.+\.(mp4)$/;
    return regex.test(url);
  }

  const flowPool = useFlowStore((state) => state.flowPool);
  const flowPoolNode = (flowPool[nodeId] ?? [])[
    (flowPool[nodeId]?.length ?? 1) - 1
  ];
  let results: OutputLogType | LogsLogType =
    (type === "Outputs"
      ? flowPoolNode?.data?.outputs[outputName]
      : flowPoolNode?.data?.logs[outputName]) ?? {};
  const resultType = results?.type;
  let resultMessage = results?.message ?? {};
  const RECORD_TYPES = ["data", "object", "array", "message"];
  if (resultMessage?.raw) {
    resultMessage = resultMessage.raw;
  }
  return type === "Outputs" ? (
    <>
      <Case condition={!resultType || resultType === "unknown"}>
        <div>NO OUTPUT</div>
      </Case>
      <Case condition={resultType === "error" || resultType === "ValueError"}>
        <ErrorOutput
          value={`${resultMessage.errorMessage}\n\n${resultMessage.stackTrace}`}
        ></ErrorOutput>
      </Case>

      <Case condition={isBase64Image(resultMessage)}>
        <div className="mx-auto h-auto w-full max-w-sm">
          <img
            src={resultMessage}
            alt="Embedded Base64"
            className="h-auto w-full max-w-full object-contain"
          />
        </div>
      </Case>

      <Case condition={isVideoUrl(resultMessage)}>
        <div className="mx-auto h-auto w-full max-w-sm">
          <video controls className="h-auto w-full max-w-full object-contain">
            <source src={resultMessage} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </Case>

      <Case
        condition={
          resultType === "text" &&
          !isBase64Image(resultMessage) &&
          !isVideoUrl(resultMessage)
        }
      >
        <TextOutputView left={false} value={resultMessage} />
      </Case>

      <Case condition={RECORD_TYPES.includes(resultType)}>
        <DataOutputComponent
          rows={
            Array.isArray(resultMessage)
              ? (resultMessage as Array<any>).every((item) => item.data)
                ? (resultMessage as Array<any>).map((item) => item.data)
                : resultMessage
              : Object.keys(resultMessage).length > 0
                ? [resultMessage]
                : []
          }
          pagination={true}
          columnMode="union"
        />
      </Case>

      <Case condition={resultType === "stream"}>
        <div className="flex h-full w-full items-center justify-center align-middle">
          <Alert variant={"default"} className="w-fit">
            <ForwardedIconComponent
              name="AlertCircle"
              className="h-5 w-5 text-primary"
            />
            <AlertTitle>{"Streaming is not supported"}</AlertTitle>
            <AlertDescription>
              {
                "Use the playground to interact with components that stream data"
              }
            </AlertDescription>
          </Alert>
        </div>
      </Case>
    </>
  ) : (
    <DataOutputComponent
      rows={
        Array.isArray(results)
          ? (results as Array<any>).every((item) => item.data)
            ? (results as Array<any>).map((item) => item.data)
            : results
          : Object.keys(results).length > 0
            ? [results]
            : []
      }
      pagination={true}
      columnMode="union"
    />
  );
};

export default SwitchOutputView;
