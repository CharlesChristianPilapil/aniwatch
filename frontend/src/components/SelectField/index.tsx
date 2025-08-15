import { 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    type SelectProps 
} from "@mui/material"

type SelectFieldType = {
    options: { value: string, label: string }[];
    label: string;
    removeEmptyOption?: boolean;
} & SelectProps<string>;

const SelectField = ({ options, label, removeEmptyOption = false, ...props }: SelectFieldType) => {

    const items = !removeEmptyOption ? [{label: "None", value: ""}, ...options] : options;
    
    return (
        <FormControl 
            variant="outlined" 
            className="w-full [&_.MuiOutlinedInput-notchedOutline]:border-main hover:[&_.MuiOutlinedInput-notchedOutline]:border-secondary-accent focus-within:[&_.MuiOutlinedInput-notchedOutline]:border-main [&_.MuiSvgIcon-root]:text-main"
        >
            <InputLabel 
                id={`${props.id || "select"}-label`} 
                className="text-main"
            >
                {label}
            </InputLabel>
            <Select
                labelId={`${props.id || "select"}-label`}
                label={label} 
                defaultValue={props.value || ""}
                {...props}
                className="text-main text-sm"
            >
                {items.map((item) => (
                    <MenuItem 
                        key={item.value} 
                        value={item.value} 
                        className="text-sm"
                    >
                        {!item.value ? <em>{item.label}</em> : item.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SelectField;