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
      <Button
        className="flex justify-start gap-2 text-xs font-semibold"
        onClick={() => {
          navigator.clipboard.writeText(sharedLink);
          Toast.Success("Link Copiado");
        }}
      >
        <ImShare className="h-4 w-4" />
        Link
      </Button>
  );
}

export default FormLinkShare;
