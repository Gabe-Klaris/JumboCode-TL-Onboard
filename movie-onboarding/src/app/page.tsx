import { redirect } from "next/navigation";
import { ModalButton } from "@/components/test";

export default function Home() {
  //redirect('/list/1');
  return (
    <div className="">
      <ModalButton />
    </div>
  );
}
