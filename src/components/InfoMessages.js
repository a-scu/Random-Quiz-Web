import Message from "./Message";

const InfoMessages = () => {
  return (
    <div className="flex w-fit p-4 bg-black flex-col gap-4 rounded-lg">
      <Message>All questions must have at least two answers.</Message>

      <Message>
        Your quiz must have at least two personalities. Click{" "}
        <b className="font-semibold">Add Personality Type</b> to start creating
        them.
      </Message>
    </div>
  );
};

export default InfoMessages;
