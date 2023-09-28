import Link from "next/link";
import React from "react";
import { BsChatLeft } from "react-icons/bs";
import { BiTrashAlt } from "react-icons/bi";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import db from "../../firebase";

type props = {
  chatId: string;
};

const ChatRow = ({ chatId }: props) => {
  const style = {
    icon: "h-5 w-5 font-bold      text-white",
    container: "flex  items-center  chatbox",

    chat_name: "flex-1  ml-2 truncate text-xs md:text-sm  md:inline-flex",
  };

  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [active, setActive] = React.useState(false);

  const [messages] = useCollection(
    collection(db, "users", session?.user?.email!, "chats", chatId, "messages")
  );

  React.useEffect(() => {
    if (!pathname) return;

    setActive(pathname.includes(chatId));
  }, [pathname]);

  // delete chat

  const deleteChat = async () => {
    await deleteDoc(doc(db, "users", session?.user?.email!, "chats", chatId));
    router.replace("/");
  };

  return (
    <Link
      className={style.container + ` ${active && "bg-[#2B2C2F]"}  `}
      href={`/chat/${chatId}`}
    >
      <BsChatLeft className={style.icon} />

      {/* chat name */}
      <span className={style.chat_name}>
        {messages?.docs[messages?.docs.length - 1]?.data().messages.text ||
          "new chat"}
        new chat
      </span>
      {/* delete btn */}

      <BiTrashAlt
        onClick={deleteChat}
        className={style.icon + "   hover:text-red-400"}
      />
    </Link>
  );
};

export default ChatRow;
