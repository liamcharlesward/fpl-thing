import type { IconType } from "react-icons";

export interface StatBoxProps {
    icon?: IconType,
    label: String,
    value: String,
    valueStyling?: React.CSSProperties,
}

const defaultValueStyling = {
    fontSize: '1.25rem',
    fontWeight: '700'
}

export const StatBox = (props: StatBoxProps) => {
    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
        }}>
            <span style={{

                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                {props.icon && (<props.icon size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />)}
                {props.label}
            </span>
            <span style={props.valueStyling ? { ...defaultValueStyling, ...props.valueStyling } : defaultValueStyling}>{props.value}</span>
        </div >
    );
}
