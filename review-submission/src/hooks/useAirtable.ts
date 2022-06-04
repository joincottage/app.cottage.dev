import Airtable from "airtable";
import { useEffect, useState } from "react";

// FIXME: Move behind API to hide Airtable API key
const base = new Airtable({ apiKey: "keyk0tDEC8slUu1HI" }).base(
  "appk7ctplKKCsOhWQ"
);

interface OwnProps {
  tableName: string;
  filterByFormula?: string;
  watch?: any;
}

export default function useAirtable({
  tableName,
  filterByFormula = "",
  watch,
}: OwnProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

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
                setError(err);
                reject(err);
                return;
              }

              resolve(data);
            }
          );
      });

      setData(data);
      setLoading(false);
    }

    fetchData();
  }, [watch]);

  return { loading, error, data };
}
