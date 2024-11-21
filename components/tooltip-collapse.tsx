type Tooltip = {
    message: string
    children: any
    visible: boolean
}

export default function TooltipCollapse({ message, children, visible }: Tooltip) {
    return (
        <div className="group relative w-full flex">
            {children}
            <span className={`absolute bottom-10 right-0 w-200 scale-0 transition-all rounded bg-[#642bae] p-2 text-xs text-white ${visible ? 'group-hover:scale-100' : ''}`}>
                {message}
            </span>
        </div>
    );
}


