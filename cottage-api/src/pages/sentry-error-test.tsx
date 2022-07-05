export default function SentryErrorTest() {
  return (
    <button
      type="button"
      onClick={() => {
        throw new Error("Sentry Frontend Error");
      }}
    >
      Throw error
    </button>
  );
}
