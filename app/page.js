import Link from "next/link";
import Result from "./components/ui/result";

export default function Home() {

  return (
    <main className="sm:hidden flex flex-col justify-center gap-2 items-center border p-5">
      <Link className="text-2xl" href="/admin">Result</Link>
      <Result />
      <div className="text-center p-4 bg-[#96CCC5]">
        <p className="text-2xl tracking-widest font-bold">Guess Right Win Big</p>
        <p className="text-xl bg-[#E09994] m-4 font-bold text-black">Result changes every Hour</p>
      </div>
    </main>
  );
}
