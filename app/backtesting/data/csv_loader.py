import pandas as pd


class CSVLoader:

    @staticmethod
    def load_csv(path: str):

        df = pd.read_csv(path)

        df.columns = [
            column.lower()
            for column in df.columns
        ]

        return df
