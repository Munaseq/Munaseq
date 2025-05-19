export default function Button(props: {
    onClick?: (e: any) => void;
    children: React.ReactNode;
    className?: string;
    outline?: boolean;
    gradient?: boolean;
    disabled?: boolean;
}) {
    if (props.outline) {
        return (
            <button
                disabled={props.disabled}
                className={
                    "relative bg-gradient-to-l h-10 p-[2px] from-custom-dark-purple to-custom-light-purple rounded-full grid place-items-center group text-nowrap " +
                    (props.className ? props.className : "")
                }
            >
                <div className="bg-white group-hover:bg-transparent rounded-full h-full w-full grid place-items-center mx-4 transition-all">
                    <p className="bg-gradient-to-l from-custom-dark-purple to-custom-light-purple bg-clip-text text-transparent group-hover:text-white transition-all">
                        {props.children}
                    </p>
                </div>
            </button>
        );
    }
    if (props.gradient) {
        return (
            <button
                disabled={props.disabled}
                onClick={props.onClick}
                className={
                    "px-4 h-10 bg-[length:120%] hover:bg-right transition-all bg-gradient-to-l from-custom-dark-purple to-custom-light-purple rounded-full text-white font-semibold grid place-items-center text-nowrap  " +
                    (props.className ? props.className : "")
                }
            >
                {props.children}
            </button>
        );
    }

    return (
        <button
            onClick={props.onClick}
            className={
                "px-4 h-10 bg-[length:120%] hover:bg-right transition-all bg-black hover:bg-[#222222] hover:text-white rounded-full text-white font-semibold grid place-items-center text-nowrap  " +
                (props.className ? props.className : "")
            }
        >
            {props.children}
        </button>
    );
}
