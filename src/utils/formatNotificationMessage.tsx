import React from "react";

/**
 * Parses notification message with markdown-style formatting and returns JSX
 * Supports:
 * - **text** for bold
 * - *text* for italic
 */
export const formatNotificationMessage = (message: string): React.ReactNode => {
    if (!message) return message;

    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let key = 0;

    // Regular expression to match **bold** and *italic* (but not ** inside *)
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
    let match;

    while ((match = regex.exec(message)) !== null) {
        // Add text before the match
        if (match.index > currentIndex) {
            parts.push(message.substring(currentIndex, match.index));
        }

        // Check if it's bold (**text**) or italic (*text*)
        if (match[0].startsWith('**')) {
            // Bold text
            parts.push(
                <strong key={`bold-${key++}`} className="font-bold">
                    {match[2]}
                </strong>
            );
        } else {
            // Italic text
            parts.push(
                <em key={`italic-${key++}`} className="italic">
                    {match[3]}
                </em>
            );
        }

        currentIndex = match.index + match[0].length;
    }

    // Add remaining text after last match
    if (currentIndex < message.length) {
        parts.push(message.substring(currentIndex));
    }

    // If no formatting was found, return original message
    return parts.length > 0 ? <>{parts}</> : message;
};
