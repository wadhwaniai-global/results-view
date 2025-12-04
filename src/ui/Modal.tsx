import React from 'react';
import { Modal as BootstrapModal, Button as BootstrapButton } from 'react-bootstrap';
import { Card } from './Card';

type ModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
};

export const Modal: React.FC<ModalProps> = ({
  show,
  onHide,
  title,
  children,
  footer,
  size = 'md',
  centered = true,
}) => {
  const defaultFooter = (
    <BootstrapButton variant="secondary" onClick={onHide}>
      Close
    </BootstrapButton>
  );

  // Bootstrap Modal doesn't support 'md', so we'll use undefined (default size) for 'md'
  const bootstrapSize = size === 'md' ? undefined : size;

  return (
    <BootstrapModal
      show={show}
      onHide={onHide}
      centered={centered}
      size={bootstrapSize}
      fullscreen="sm-down"
    >
      <Card className="border-0">
        <BootstrapModal.Header className="border-0">
          <BootstrapModal.Title className="text-dark fw-bold text-sm sm:text-base">{title}</BootstrapModal.Title>
          <button type="button" className="btn-close" onClick={onHide}></button>
        </BootstrapModal.Header>
        <BootstrapModal.Body className="p-3 sm:p-4">{children}</BootstrapModal.Body>
        {(footer || defaultFooter) && (
          <BootstrapModal.Footer className="border-0 d-flex flex-column flex-sm-row gap-2 p-3 sm:p-4">
            {footer || defaultFooter}
          </BootstrapModal.Footer>
        )}
      </Card>
    </BootstrapModal>
  );
};

export default Modal;

