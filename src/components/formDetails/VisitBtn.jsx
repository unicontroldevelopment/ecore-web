"use client";

import { useEffect, useState } from "react";
import { HiOutlineDocumentText } from "react-icons/hi";

const { Button } = require("../ui/button");

function VisitBtn({ shareUrl }) {
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
          window.open(sharedLink, "_blank");
        }}
      >
        <HiOutlineDocumentText className="h-4 w-4"/>
        Preencher
      </Button>
  );
}

export default VisitBtn;
