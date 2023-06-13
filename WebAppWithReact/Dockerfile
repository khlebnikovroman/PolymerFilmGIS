FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["WebAppWithReact/WebAppWithReact.csproj", "WebAppWithReact/"]
COPY ["DAL/DAL.csproj", "DAL/"]
RUN dotnet restore "WebAppWithReact/WebAppWithReact.csproj"
COPY . .

WORKDIR "/src/DAL"
RUN dotnet ef migrations add InitialMigration --project DAL.csproj --output-dir Migrations

WORKDIR "/src/WebAppWithReact"
RUN dotnet build "WebAppWithReact.csproj" -c Release -o /app/build

RUN dotnet ef database update --no-launch-profile --project ../DAL

FROM build AS publish
RUN dotnet publish "WebAppWithReact.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebAppWithReact.dll"]