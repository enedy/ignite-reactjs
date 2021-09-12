const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

// __dirname = diretório onde coloquei a instrucao

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDevelopment ? "development" : "production",
  devtool: isDevelopment ? "eval-source-map" : "source-map",
  // index.jsx = nome do arquivo de entrada
  entry: path.resolve(__dirname, "src", "index.tsx"), // no lugar da virgula, coloca a barra correta de acordo com o sistema operacional
  // arquivo q vou gerar com o webpack
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx", '.ts', '.tsx'],
  },
  devServer: {
    static: path.resolve(__dirname, "public"), // reload automatico
    hot: true,
  },
  plugins: [
    isDevelopment && new ReactRefreshWebpackPlugin({
        overlay: false,
      }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"), // acrescenta o bundle.js direto no index.html
    }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              plugins: [
                isDevelopment && require.resolve("react-refresh/babel"),
              ].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.scss$/, // toda vez q encontrar arquivo css
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"], // ler o arquivo style-loader e css-loader
      },
    ],
  },
};
