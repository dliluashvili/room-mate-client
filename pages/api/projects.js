import { faker } from "@faker-js/faker";

const maxSize = 1000;

const randomNumber = (min, max) => faker.datatype.number({ min, max });

const sentences = new Array(maxSize)
  .fill(true)
  .map(() => faker.lorem.sentence(randomNumber(20, 70)));

// an endpoint for getting projects data
export default (req, res) => {
  const cursor = parseInt(req.query.cursor) || 0;
  const pageSize = parseInt(req.query.pageSize) || 5;

  const data = Array(pageSize)
    .fill(0)
    .map((_, i) => {
      const id = i + cursor;
      return {
        name: "Project " + id + ` (server time: ${Date.now()})`,
        id: id,
        text: sentences[id],
      };
    });

  const nextId = cursor < maxSize ? data[data.length - 1].id + 1 : null;
  const previousId = cursor > -maxSize ? data[0].id - pageSize : null;

  setTimeout(() => res.json({ data, nextId, previousId }), 1000);
};
