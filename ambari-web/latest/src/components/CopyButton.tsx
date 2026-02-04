import { useState } from 'react';
import { Button, ButtonProps } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from "@fortawesome/free-solid-svg-icons";

type CopyButtonProps = {
    textToCopy: string;
    successMessage?: string;
    successDuration?: number;
    buttonText?: string;
    buttonProps?: ButtonProps;
};

export default function CopyButton({
                                       textToCopy,
                                       successMessage = 'Copied!',
                                       successDuration = 2000,
                                       buttonProps,
                                   }: CopyButtonProps) {
    const [, setCopySuccess] = useState('');

    const handleCopy = async () => {
        try {
            // Check if clipboard API is available (HTTPS required)
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textToCopy);
                setCopySuccess(successMessage);
                setTimeout(() => setCopySuccess(''), successDuration);
                return;
            }
            
            // Fallback for HTTP or older browsers
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                setCopySuccess(successMessage);
                setTimeout(() => setCopySuccess(''), successDuration);
            } catch (fallbackErr) {
                console.error("Fallback copy failed: ", fallbackErr);
                // Show user a message to manually copy
                alert(`Please copy this manually: ${textToCopy}`);
            }
            
            document.body.removeChild(textArea);
        } catch (err) {
            console.error('Failed to copy:', err);
            // Final fallback - show text for manual copy
            alert(`Please copy this manually: ${textToCopy}`);
        }
    };

    return (
        <div className="copy-button-container">
            <Button variant="border-0" size="sm" onClick={handleCopy} {...buttonProps}>
                <FontAwesomeIcon icon={faCopy} />
            </Button>
        </div>
    );
}