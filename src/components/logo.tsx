import Image from "next/image";

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <>
      <Image
        src="/images/btc-dark-on-light.svg"
        alt=""
        width={size}
        height={size}
        className="dark:hidden"
      />
      <Image
        src="/images/btc-light-on-dark.svg"
        alt=""
        width={size}
        height={size}
        className="hidden dark:block"
      />
    </>
  );
}
