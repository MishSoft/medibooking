type FieldErrorProps = {
  id: string;
  message?: string;
};

function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p className="mt-1 px-1 text-xs text-rose-300" id={id} role="alert">
      {message}
    </p>
  );
}

export default FieldError;
