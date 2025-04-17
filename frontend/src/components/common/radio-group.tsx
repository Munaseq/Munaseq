import { Label } from "./shadcn-ui/label";
import { RadioGroup, RadioGroupItem } from "./shadcn-ui/radio-group";

export default function Radio(props: {
    options: string[];
    values?: string[];
    name: string;
    defaultValue?: string;
    onChange?: () => void;
}) {
    return (
        <RadioGroup
            onValueChange={props.onChange}
            name={props.name}
            id={props.name}
            defaultValue={
                props.defaultValue
                    ? props.defaultValue
                    : props.values
                    ? props.values[0]
                    : props.options[0]
            }
            required
        >
            {props.options.map((option, index) => {
                return (
                    <div
                        key={index}
                        className="flex items-center space-x-2 gap-1"
                    >
                        <RadioGroupItem
                            value={props.values ? props.values[index] : option}
                            id={option}
                        />
                        <Label htmlFor={option}>{option}</Label>
                    </div>
                );
            })}
        </RadioGroup>
    );
}
