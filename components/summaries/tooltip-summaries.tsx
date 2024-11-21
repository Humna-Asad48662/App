
type Tooltip = {
    message: string
    children: any
    visible: boolean
}


export default function Tooltip({ message, children, visible }: Tooltip) {
    return (
        <div className="group relative w-full flex">
            {children}
            <span className={`absolute bottom-10 left-10 w-[300px] scale-0 transition-all rounded bg-[#642bae] p-2 text-xs text-white ${visible ? 'group-hover:scale-100' : ''}`}>
                <span dangerouslySetInnerHTML={{ __html: message }} />
            </span>
        </div>
    );
}