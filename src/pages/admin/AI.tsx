import { useState } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";

export const AICommandPage = () => {
  const { user } = useAuth();

  const [command, setCommand] = useState("");
  const [modalText, setModalText] = useState("");

  const handleSend = () => {
    if (!command.trim()) return;

    // Here you can later call your API: await axios.post("/api/ai", { command })
    setModalText(command);
  };

  return (
    <div className="min-h-screen p-10 bg-gray-50 flex flex-col items-center">
      <h1 className="text-xl font-bold">
        Take the Suggestions as a {user?.role.toUpperCase()}
      </h1>

      <div className="w-4/5 space-y-3 flex justify-center flex-col">
        <Input
          placeholder="Type a command for AI…"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="text-lg pt-4"
        />

        <div className="flex justify-center pb-10">
          <Button onClick={handleSend} className="w-fit px-2 py-1 text-lg">
            Send to Modal
          </Button>
        </div>
      </div>

      {/* MODAL */}
      <Card className="w-full min-h-40">
        <CardHeader>AI Command Output</CardHeader>
        <CardBody className="w-4/5">
          <p>{modalText}</p>
        </CardBody>
      </Card>
    </div>
  );
};
