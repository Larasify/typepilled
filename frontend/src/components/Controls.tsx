
const Controls = () =>  {
  return (
    <div className="font-primary flex flex-col items-center justify-end gap-2">
      <div className="flex items-center space-x-2 font-roboto text-sm text-neutral-500">
        <kbd className="kbd rounded-lg">tab</kbd>
        <span className="text-hl"> + </span>
        <kbd className="kbd rounded-lg">enter</kbd>
        <span className="text-hl"> or </span>
        <kbd className="kbd rounded-lg">esc</kbd>

        <span className="text-hl "> - restart test </span>
      </div>
    </div>
  );
}

export default Controls;
