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

RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"
RUN dotnet-ef migrations add $(date '+%Y%m%d%H%M%S')_AUTO --project DAL/DAL.csproj --startup-project WebAppWithReact/WebAppWithReact.csproj --context DAL.Context --configuration Release --output-dir Migrations


WORKDIR "/src/WebAppWithReact"
RUN dotnet build "WebAppWithReact.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WebAppWithReact.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebAppWithReact.dll"]