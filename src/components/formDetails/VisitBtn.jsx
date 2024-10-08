"use client";

import { useEffect, useState } from "react";

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
      className="w-[205px]"
      onClick={() => {
        window.open(sharedLink, "_blank");
      }}
    >
      Preencher
    </Button>
  );
}

export default VisitBtn;
