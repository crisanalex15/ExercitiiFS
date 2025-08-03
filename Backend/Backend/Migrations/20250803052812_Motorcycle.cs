using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class Motorcycle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Motociclete",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Brand = table.Column<string>(type: "TEXT", nullable: false),
                    Model = table.Column<string>(type: "TEXT", nullable: false),
                    Year = table.Column<string>(type: "TEXT", nullable: false),
                    Color = table.Column<string>(type: "TEXT", nullable: false),
                    FuelType = table.Column<string>(type: "TEXT", nullable: false),
                    Transmission = table.Column<string>(type: "TEXT", nullable: false),
                    Mileage = table.Column<string>(type: "TEXT", nullable: false),
                    Price = table.Column<string>(type: "TEXT", nullable: false),
                    EngineId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Motociclete", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Motociclete_Engines_EngineId",
                        column: x => x.EngineId,
                        principalTable: "Engines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Motociclete_EngineId",
                table: "Motociclete",
                column: "EngineId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Motociclete");
        }
    }
}
