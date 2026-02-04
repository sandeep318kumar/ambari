import CopyButton from './CopyButton';

type ResponseModalBodyProps = {
    responseText: string;
};

export default function ResponseModalBody({ responseText }: ResponseModalBodyProps) {
    return (
        <div>
            {/* Copy Button */}
            <div className="d-flex justify-content-end mb-2">
                <CopyButton textToCopy={responseText} />
            </div>
            {/* Response Text */}
            <div className="pre-wrap">{responseText}</div>
        </div>
    );
}