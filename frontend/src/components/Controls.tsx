export function Controls() {
  return (
    <div className="font-primary absolute left-0 top-0 flex flex-col items-center justify-end gap-2">
      <div className="flex items-center space-x-2 font-roboto text-sm text-neutral-500">
        <kbd className="kbd">tab</kbd>
        <span className="text-hl"> + </span>
        <kbd className="kbd">enter</kbd>
        <span className="text-hl"> or </span>
        <kbd className="kbd">esc</kbd>

        <span className="text-hl"> - restart test </span>
      </div>
    </div>
  );
}
