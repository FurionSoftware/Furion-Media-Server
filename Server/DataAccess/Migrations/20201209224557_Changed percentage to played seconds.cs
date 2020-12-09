using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccess.Migrations
{
    public partial class Changedpercentagetoplayedseconds : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PercentageWatched",
                table: "MediaItems");

            migrationBuilder.AddColumn<int>(
                name: "DurationPlayed",
                table: "MediaItems",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DurationPlayed",
                table: "MediaItems");

            migrationBuilder.AddColumn<double>(
                name: "PercentageWatched",
                table: "MediaItems",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
