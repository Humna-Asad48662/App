import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {

  const handleTranslationRedirect = () => {
    redirect('/translation');
  }

  return (
    <>
      <header className="w-full mt-4 mb-10">
        <h1 className="text-4xl font-semibold leading-none tracking-tight text-center">
          AI News Tools
        </h1>
      </header>

      <ul className="flex flex-col items-center justify-center gap-3">
        <li>
          <Link
            href="/translationV2"
            className="flex w-[350px] mx-auto items-center justify-center rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-9 px-5 py-6">
            Initial Translation
          </Link>
        </li>
        <li>
          <Link
            href="/translationV3"
            className="flex w-[350px] mx-auto items-center justify-center rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-9 px-5 py-6">
            Write Through Translation
          </Link>
        </li>
        <li>
          <Link
            href="/headline"
            className="flex w-[350px] mx-auto items-center justify-center rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-9 px-5 py-6">
            Headlines
          </Link>
        </li>
        {/* <li>
          <Link
            href="/summaries"
            className="flex w-[350px] mx-auto items-center justify-center rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-heart-800 text-primary-foreground shadow hover:bg-purple-heart-500 h-9 px-5 py-6">
            Summaries
          </Link>
        </li> */}
      </ul>
    </>
  );
}
