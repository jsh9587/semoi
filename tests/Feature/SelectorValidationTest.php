<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class SelectorValidationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware();
    }

    /**
     * Test that the selector validator returns extracted content for a valid CSS selector.
     */
    public function test_selector_validator_returns_extracted_content_for_css_selector()
    {
        $response = $this->postJson('/admin/validate-selector', [
            '_token' => csrf_token(),
            'url' => 'https://www.google.com',
            'selector_type' => 'css',
            'selector_value' => 'title',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['extracted_content']);

        $this->assertNotEmpty($response->json('extracted_content'));
    }

    /**
     * Test that the selector validator returns extracted content for a valid XPath selector.
     */
    public function test_selector_validator_returns_extracted_content_for_xpath_selector()
    {
        $response = $this->postJson('/admin/validate-selector', [
            '_token' => csrf_token(),
            'url' => 'https://www.google.com',
            'selector_type' => 'xpath',
            'selector_value' => '//title',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['extracted_content']);

        $this->assertNotEmpty($response->json('extracted_content'));
    }

    /**
     * Test that the selector validator returns an error for an invalid URL.
     */
    public function test_selector_validator_returns_error_for_invalid_url()
    {
        $response = $this->postJson('/admin/validate-selector', [
            '_token' => csrf_token(),
            'url' => 'invalid-url',
            'selector_type' => 'css',
            'selector_value' => 'title',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['url']);
    }

    /**
     * Test that the selector validator returns an error when selector does not match.
     */
    public function test_selector_validator_returns_empty_content_when_selector_does_not_match()
    {
        $response = $this->postJson('/admin/validate-selector', [
            '_token' => csrf_token(),
            'url' => 'https://www.google.com',
            'selector_type' => 'css',
            'selector_value' => '#nonexistent-element',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['extracted_content' => '']);
    }
}
