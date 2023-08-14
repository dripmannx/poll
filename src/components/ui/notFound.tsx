import Link from "next/link";
import { Button } from "./button";
const NotFound = () => {
  return (
    <div className="flex-grow-1 flex h-[] flex-col items-center justify-center overflow-hidden ">
      <h1 className="mb-4 text-4xl font-semibold">
        404 - Seite nicht gefunden
      </h1>
      <p className="mb-8 text-gray-500">
        Diese Seite exestiert nicht oder wurde gelöscht
      </p>
      <Link href="/">
        <Button>Zurck zu Startseite</Button>
      </Link>
    </div>
  );
};

export default NotFound;
