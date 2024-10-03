"use client";

import { useEffect, useState } from "react";
import { ImShare } from "react-icons/im";
import { Toast } from "../toasts";

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
    <div className="flex flex-grow items-center w-[205px]">
      <Button
        className="max-w-[205px] w-[205px] "
        onClick={() => {
          navigator.clipboard.writeText(sharedLink);
          Toast.Success("Link Copiado");
        }}
      >
        <ImShare className="mr-2 h-4 w-4" />
        Link
      </Button>
    </div>
  );
}

export default FormLinkShare;
