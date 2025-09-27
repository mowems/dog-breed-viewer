export default function ErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="error">
      <strong>Something went wrong.</strong>
      <div className="small">{message}</div>
    </div>
  );
}
