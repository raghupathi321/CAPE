import React, { useState } from 'react';
import axios from 'axios';
import { QRCode } from 'qrcode.react';

const ShortenLessonLink = () => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [error, setError] = useState('');

    const handleShorten = async () => {
        if (!originalUrl) return;

        try {
            const response = await axios.get(
                `https://tinyurl.com/api-create.php?url=${encodeURIComponent(originalUrl)}`
            );
            if (response.data) {
                setShortUrl(response.data);
                setError('');
            } else {
                setError('Failed to shorten the URL');
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Try again.');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shortUrl);
        alert('Short URL copied to clipboard!');
    };

    return (
        <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Shorten Lesson URL</h2>

            <input
                type="text"
                placeholder="Enter full lesson URL"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="w-full border p-2 mb-3 rounded"
            />

            <button
                onClick={handleShorten}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Shorten URL
            </button>

            {error && <p className="text-red-600 mt-2">{error}</p>}

            {shortUrl && (
                <div className="mt-4">
                    <input
                        type="text"
                        readOnly
                        value={shortUrl}
                        className="w-full border p-2 mb-2 rounded"
                    />
                    <button
                        onClick={handleCopy}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Copy
                    </button>

                    <div className="mt-4 flex justify-center">
                        <QRCode value={shortUrl} size={128} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShortenLessonLink;
