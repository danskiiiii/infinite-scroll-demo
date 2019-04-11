/**
 * @param {string} title -- query text
 * @param {number} idx -- index of the first item (pagination)
 * @param {number} max -- maximum number of items accepted (pagination)
 * @returns {Object} -- an object with book details
 */
export async function getQueryResult(title, idx, max) {
  const url = 'https://www.googleapis.com/books/v1/volumes';
  try {
    const response = await fetch(
      `${url}?q=intitle:${title}&startIndex=${idx}&maxResults=${max}
&fields=items(volumeInfo/description,volumeInfo/title,volumeInfo/imageLinks),totalItems`
    );
    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
}
