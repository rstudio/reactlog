library(shiny)
# Enable reactlog
reactlog::reactlog_enable()

# The app below is a VERY condensed form of shiny::runExample("03_reactivity")
#   with the reactlog module added in the `ui` and `server`
ui <- fluidPage(
  titlePanel("Reactivity"),
  sidebarLayout(
    sidebarPanel(
      textInput(inputId = "caption", label = "Caption:", value = "Data Summary"),
      selectInput(inputId = "dataset", label = "Choose a dataset:", choices = c("rock", "pressure", "cars")),
      numericInput(inputId = "obs", label = "Number of observations to view:", value = 10)
    ),
    mainPanel(
      h3(textOutput("caption", container = span)),
      verbatimTextOutput("summary"),
      tableOutput("view")
    )
  ),
  ### start module ui
  reactlog::reactlog_module_ui(include_refresh = TRUE)
  ### end module ui
)

server <- function(input, output) {
  datasetInput <- reactive({
    switch(input$dataset, "rock" = rock, "pressure" = pressure, "cars" = cars)
  })
  output$caption <- renderText({ input$caption })
  output$summary <- renderPrint({ summary(datasetInput()) })
  output$view <- renderTable({ head(datasetInput(), n = input$obs) })

  ### start module server
  reactlog::reactlog_module_server()
  ### end module server
}

shinyApp(ui = ui, server = server)
