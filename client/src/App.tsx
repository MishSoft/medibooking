import { useQuery } from "@tanstack/react-query";
import "./App.css";
import { postsQueryOptions } from "./router/queryClient";
import DropDown from "./components/ui/DropDown";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import Checkbox from "./components/ui/Checkbox";
import { useState } from "react";
import Toast from "./components/ui/Toast";
import Modal from "./components/ui/Modal";
import Badge from "./components/ui/Badge";

function App() {
  const { data: posts } = useQuery(postsQueryOptions());
  const [isChecked, setIsChecked] = useState(false)
  console.log(posts);

  return (
    <div className="pl-20">
      <h1 className="text-3xl text-center font-bold underline">Hello world!</h1>
      <DropDown data={["tbilisi", "sagarejo", "mcxeta"]} className={" "} />
      <br />
      <Button className="bg-[#070F21] max-w-100 text-[#BBCABF] mt-10">
        Sign in
      </Button>
      <br />
      <Input placeholder="სახელი"  />
      <br />
      <Checkbox checked={isChecked} onCheck={() => setIsChecked(prev => !prev)} />
      <br />
      <Toast type="info" result={"თქვენ გაქვთ ერთი გამოტოვებული შეტყობინება"} />
      <br />
      <Modal open={false} onCancel={function (): void {
        throw new Error("Function not implemented.");
      }} >
        <p className="font-semibold text-[#BBCABF]">ნამდვილად გსურთ ამ ოპერაციის შესრულება?</p>
        <p className="text-[#BBCABF]/70">
          თქვენი ვიზიტის წაშლით, ასევე წაიშლება პაციენტის მონაცემები და დაგეგმილი საათები.
        </p>
      </Modal>
      <Badge status="cancelled"/>
    </div>
  );
}

export default App;
