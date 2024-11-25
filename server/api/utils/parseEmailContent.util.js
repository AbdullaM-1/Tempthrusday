const getAndDecodeBody = (email) => {
  const part = email.payload.parts?.find(
    (part) => part.mimeType === "text/plain"
  );
  return part ? Buffer.from(part.body.data, "base64").toString("utf8") : null;
};

function parseEmailContent(email) {
  // Attempt to parse from snippet first
  const snippet = email.snippet || "";
  let senderName = snippet.match(
    /&lt;https:\/\/www.wellsfargo.com&gt; (.*) sent you/
  )?.[1];
  let amount = snippet
    .match(/sent you \$([0-9,]+\.[0-9]{2})/)?.[1]
    ?.replace(/,/, "");
  let date = snippet.match(/Date: \*([0-9]{2}\/[0-9]{2}\/[0-9]{4})\*/)?.[1];
  let confirmation = snippet.match(/Confirmation: \*([A-Za-z0-9]+)\*/)?.[1];
  let memo = snippet.match(/Memo: \*([A-Za-z0-9 ]+)\*/)?.[1];

  // If any field is missing, decode the body and attempt extraction
  if (!senderName || !amount || !date || !confirmation) {
    const decodedBody = getAndDecodeBody(email);
    if (decodedBody) {
      senderName = senderName || decodedBody.match(/From: (.*) <.*>/)?.[1];
      amount =
        amount ||
        decodedBody
          .match(/sent you \$([0-9,]+\.[0-9]{2})/)?.[1]
          ?.replace(/,/, "");
      date =
        date ||
        decodedBody.match(/Date: \*([0-9]{2}\/[0-9]{2}\/[0-9]{4})\*/)?.[1];
      confirmation =
        confirmation ||
        decodedBody.match(/Confirmation: \*([A-Za-z0-9]+)\*/)?.[1];
      memo = memo || decodedBody.match(/Memo: \*([A-Za-z0-9 ]+)\*/)?.[1];
    }
  }

  // Return parsed data as structured output
  return {
    senderName: senderName || null,
    amount: amount ? parseFloat(amount) : null,
    date: date ? new Date(date) : null,
    confirmation: confirmation || null,
    memo: memo || null,
  };
}

module.exports = { parseEmailContent };
