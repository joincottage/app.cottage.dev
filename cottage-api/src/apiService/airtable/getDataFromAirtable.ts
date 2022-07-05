import base from './base';

interface RequiredParams {
  tableName: string;
  filterByFormula?: string;
}

export default async function getDataFromAirtable({ tableName, filterByFormula = "" }: RequiredParams): Promise<{ data: any[] }> {
  const data = await new Promise<any[]>((resolve, reject) => {
    const data: any[] = [];
    base(tableName)
      .select({
        filterByFormula,
        view: "Grid view",
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function (record) {
            data.push(record.fields);
          });

          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }

          resolve(data);
        }
      );
  });

  return { data };
}