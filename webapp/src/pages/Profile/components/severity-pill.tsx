import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const SeverityPillRoot = styled('span')((props: { theme:any, ownerState:any }) => {
    const backgroundColor = props.theme.palette[props.ownerState.color].main;
    const color = props.theme.palette[props.ownerState.color].contrastText;

    return {
        alignItems: 'center',
        backgroundColor,
        borderRadius: 12,
        color,
        cursor: 'default',
        display: 'inline-flex',
        flexGrow: 0,
        flexShrink: 0,
        fontFamily: props.theme.typography.fontFamily,
        fontSize: props.theme.typography.pxToRem(12),
        lineHeight: 2,
        fontWeight: 600,
        justifyContent: 'center',
        letterSpacing: 0.5,
        minWidth: 20,
        paddingLeft: props.theme.spacing(1),
        paddingRight: props.theme.spacing(1),
        textTransform: 'uppercase',
        whiteSpace: 'nowrap'
    };
});

export const SeverityPill = (props:any) => {
    const { color = 'primary', children, ...other } = props;

    const ownerState = { color };

    return (
        <SeverityPillRoot
            ownerState={ownerState}
            {...other}
        >
            {children}
        </SeverityPillRoot>
    );
};

SeverityPill.propTypes = {
    children: PropTypes.node,
    color: PropTypes.oneOf([
        'primary',
        'secondary',
        'error',
        'info',
        'warning',
        'success'
    ])
};
