import { Container } from "app/_components/layout/container";
import { LoadingSpinner } from "app/_components/loading-spinner";

export default function Loading() {
  return (
    <div className="flex grow flex-col">
      <Container className="mx-auto ml-10 flex grow items-center justify-center px-4 pt-20">
        <LoadingSpinner height={32} />
      </Container>
    </div>
  );
}
