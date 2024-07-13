
export const convertDate = (date: Date) => {
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });

    const formattedTime = date.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
    });

    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    return formattedDateTime;
}