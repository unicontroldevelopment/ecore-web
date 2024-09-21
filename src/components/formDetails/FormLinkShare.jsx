"use client";

import { useEffect, useState } from "react";
import { ImShare } from "react-icons/im";
import { Toast } from "../toasts";
import { Input } from "../ui/input";

const { Button } = require("../ui/button");

function FormLinkShare({ shareUrl }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const sharedLink = `${window.location.origin}/submit/${shareUrl}`;

  return (
    <div className="flex flex-grow gap-4 items-center border rounded-md shadow-md bg-white">
      <Input value={sharedLink} readOnly />
      <Button
        className="max-w-[250px]"
        onClick={() => {
          navigator.clipboard.writeText(sharedLink);
          Toast.Success("Link Copiado");
        }}
      >
        <ImShare className="mr-2 h-4 w-4" />
        Compartilhar Link
      </Button>
    </div>
  );
}

export default FormLinkShare;
