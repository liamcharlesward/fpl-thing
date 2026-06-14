import type { IconType } from "react-icons";

export interface BadgeProps {
    icon?: IconType,
    text: string,
    colour: string,
}

export const Badge = (props: BadgeProps) => {
    return (
        <div style={{
            color: `var(--color-${props.colour})`,
            background: `var(--color-${props.colour}-bg)`,
            borderColor: `var(--color-${props.colour})`,
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.25rem 0.6rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            border: '1px solid',
            gap: '0.25rem'

        }}>
            {props.icon && <props.icon size={14} style={{ display: 'inline' }} />}
            {props.text}
        </div>
    )
}