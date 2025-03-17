import { FC } from "react";
import { Form, FormCol, FormRow, Select, SelectOption } from '@alxgrn/telefrag-ui';

const formatOptions: SelectOption[] = [{
    option: "delta",
    value: "delta",
},{
    option: "video",
    value: "video",
}];

const modeOptions: SelectOption[] = [{
    option: "viewer",
    value: "viewer",
},{
    option: "notes",
    value: "notes",
},{
    option: "editor",
    value: "editor",
}];

type Props = {
    mode: string;
    format: string;
    changed?: boolean;
    onChange: (mode: string, format: string) => void;
};

const ModeSelector: FC<Props> = ({ mode, format, changed, onChange }) => {

    return (<div className={changed ? 'toolbar changed' : 'toolbar'}>
    <Form>
        <FormRow>
            <FormCol>
                <Select
                    id='format'
                    value={format}
                    options={formatOptions}
                    onChange={format => onChange('viewer', format)}
                />
            </FormCol>
            <FormCol>
                <Select
                    id='mode'
                    value={mode}
                    options={modeOptions}
                    onChange={mode => onChange(mode, format)}
                />
            </FormCol>
        </FormRow>
    </Form>
    </div>);
};

export default ModeSelector;
