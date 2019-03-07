import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.75);
    z-index: 10000;
    visibility: hidden;
    opacity: 0;
    transition: opacity 200ms;
    &.active {
        opacity: 1;
        visibility: visible;
    }
`;

export default function Modal(props) {
    const {
        isShow,
        onClose,
    } = props;
    return (
        <ModalWrapper
            className={isShow ? 'active' : ''}
            onClick={onClose}
        >
            <div onClick={e => e.stopPropagation()}> {/* eslint-disable-line */}
                {props.children}
            </div>
        </ModalWrapper>
    );
}

Modal.propTypes = {
    isShow: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
